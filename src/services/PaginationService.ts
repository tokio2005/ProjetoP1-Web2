import { FindOptionsOrder, FindOptionsRelations, ObjectLiteral, Repository } from "typeorm";

export interface PaginationResult<T> {
    data: T[];
    pagination: {
        currentPage: number;
        perPage: number;
        totalItems: number;
        lastPage: number;
        prevPage: number | null;
        nextPage: number | null;
    };
}

export class PaginationService {
    static async paginate<T extends ObjectLiteral>(
        repository: Repository<T>,
        page: number = 1,
        limit: number = 10,
        order: FindOptionsOrder<T> = {},
        relations?: FindOptionsRelations<T>
    ): Promise<PaginationResult<T>> {
        page = Math.max(page, 1);
        limit = Math.min(Math.max(limit, 1), 100);

        const [data, totalItems] = await repository.findAndCount({
            order,
            relations,
            skip: (page - 1) * limit,
            take: limit,
        });

        const lastPage = Math.max(Math.ceil(totalItems / limit), 1);

        return {
            data,
            pagination: {
                currentPage: page,
                perPage: limit,
                totalItems,
                lastPage,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < lastPage ? page + 1 : null,
            },
        };
    }
}