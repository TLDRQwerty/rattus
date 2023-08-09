import type {PaginatedResponse} from '../hooks/use-infinite-query';

export function updateItem<TItem extends {id: string}>(
  oldData: PaginatedResponse<TItem> | undefined,
  newData: TItem,
): PaginatedResponse<TItem> | undefined {
  const dataClone = JSON.parse(
    JSON.stringify(oldData),
  ) as PaginatedResponse<TItem>;
  if (oldData) {
    dataClone.pages = oldData.pages.map(page => {
      page.data = page.data.map(result => {
        if (result.id === newData.id) {
          result = newData;
        }
        return result;
      });
      return page;
    });

    return dataClone;
  }
  return oldData;
}
