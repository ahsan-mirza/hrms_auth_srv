export class PaginationDto {
  page?: number = 1;
  limit?: number = 10;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
}
