import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

export abstract class EntityRepository<T extends Document, F> {
  constructor(protected readonly entityModel: Model<T>) {}

  async findOne(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ): Promise<T | null> {
    return this.entityModel
      .findOne(entityFilterQuery, {
        _id: 0,
        __v: 0,
        ...projection,
      })
      .exec();
  }
  async find(entityFilterQuery: FilterQuery<T>): Promise<T[] | null> {
    return this.entityModel.find(entityFilterQuery);
  }

  async create(createdEntity: F): Promise<T> {
    const id = (await this.entityModel.find().count().exec()) + 1;
    const entity = new this.entityModel({ id, ...createdEntity });
    return entity.save();
  }

  async findOneAndUpdate(
    entityFilterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<T>,
  ): Promise<T | null> {
    return this.entityModel.findOneAndUpdate(
      entityFilterQuery,
      updateEntityData,
      {
        new: true,
      },
    );
  }

  async remove(entityFilterQuery: FilterQuery<T>): Promise<T | null> {
    return this.entityModel.remove(entityFilterQuery);
  }
}
