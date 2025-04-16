import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractDocument } from './abstract.schema';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(createDocument: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...createDocument,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn(
        `Document not found for query: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException(
        `Document not found for query: ${JSON.stringify(filterQuery)}`,
      );
    }
    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      new: true,
    });

    if (!document) {
      this.logger.warn(
        `Document not found for query: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException(
        `Document not found for query: ${JSON.stringify(filterQuery)}`,
      );
    }
    return document;
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery).lean<TDocument[]>(true);
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);

    if (!document) {
      this.logger.warn(
        `Document not found for query: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException(
        `Document not found for query: ${JSON.stringify(filterQuery)}`,
      );
    }

    return document;
  }
}
