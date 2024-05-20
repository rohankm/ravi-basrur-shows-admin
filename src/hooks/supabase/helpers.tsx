import { QueryClient, QueryKey } from "@tanstack/react-query";

export const getKeys = (query: any) => {
  return [
    "public",
    "table",
    query.url.pathname.split("/").pop(),
    query.url.search.split("&").filter((d: any) => !d.startsWith("?select")),
  ];
};

interface D extends Record<string, any> {
  id: string;
}

function sortByProperty(
  arr: D[],
  prop: string,
  order: "asc" | "desc" = "asc"
): D[] {
  const sortOrder: number = order === "desc" ? -1 : 1;

  return [...arr].sort((a, b) => {
    if (a[prop] < b[prop]) {
      return -1 * sortOrder;
    }
    if (a[prop] > b[prop]) {
      return 1 * sortOrder;
    }
    return 0;
  });
}

const handelUpdatedData = ({
  cachedData,
  newData,
  addFirst,
  key,
  pages = true,
}: {
  cachedData: any;
  newData: any;
  addFirst: any;
  key: any;
  pages?: boolean;
}) => {
  const isArray = Array.isArray(cachedData);
  let updatedData: D[] | D | null = null;
  switch (true) {
    case isArray && newData.is_deleted:
      updatedData = cachedData.filter((d: any) => d.id !== newData.id);
      break;
    case !isArray && newData.is_deleted:
      updatedData = null;
      break;
    case !isArray:
      updatedData = newData;
      break;
    case isArray:
      updatedData = cachedData;
      const find = updatedData.findIndex((d) => d.id == newData.id);
      // console.log(find);
      if (find !== -1) {
        updatedData[find] = newData;
      } else {
        if (addFirst) updatedData.unshift(newData);
        else if (pages) updatedData.push(newData);
      }
      break;
  }

  const filters = key[3] as string[];

  filters.forEach((filter: string) => {
    const parts = filter.split("=");
    const operatorAndData = parts[1].split(".");

    const key = parts[0];
    const columnName = operatorAndData[0];
    const operator: "asc" | "desc" = operatorAndData[1] as "asc" | "desc";

    console.log(key, operator, columnName);
    if (Array.isArray(updatedData))
      switch (key) {
        case "order":
          updatedData = sortByProperty(updatedData, columnName, operator);
          break;
      }
  });

  return updatedData;
};

export const upsertWithQuery = ({
  queryClient,
  queryKey,
  newData,
  addFirst,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  newData: D;
  addFirst: boolean;
}) => {
  const queryKeys = queryClient
    .getQueryCache()
    .getAll()
    .map((cache) => cache.queryKey);
  const queryKeysFiltered = queryKeys.filter((key) => {
    const tableFilter =
      key[0] == queryKey[0] && key[1] == queryKey[1] && key[2] == queryKey[2];

    if (!tableFilter) return false;

    const filters = key[3] as string[];
    // console.log({ filters });

    const final = filters.reduce((acc: boolean, filter: string) => {
      const parts = filter.split("=");
      const operatorAndData = parts[1].split(".");

      const key = parts[0];
      const operator = operatorAndData[0];
      const data = operatorAndData[1];

      // console.log(key, operator, data);
      switch (operator) {
        case "eq":
          return acc && newData[key] === data;
      }

      return acc;
    }, true);

    // console.log(filters, final);

    return final;
  });

  queryKeysFiltered.map((key) => {
    queryClient.setQueryData(key, (oldData: any) => {
      if (oldData.pages) {
        let updatedPages = oldData.pages.map((page: any, index: number) => {
          const updatedData = handelUpdatedData({
            cachedData: page.data,
            addFirst,
            key,
            newData,
            pages: index == 0,
          });

          return {
            ...page,
            data: updatedData,
          };
        });

        console.log(updatedPages);
        return { ...oldData, pages: updatedPages };
      }

      const updatedData = handelUpdatedData({
        cachedData: oldData.data,
        addFirst,
        key,
        newData,
      });
      console.log({ updatedData });

      return { ...oldData, data: updatedData };
    });
  });

  // queryClient.setQueriesData(
  //   {
  //     predicate: (query) => {
  //       const queryKeyFetched = query.queryKey;

  //       const tableFilter =
  //         queryKeyFetched[0] == queryKey[0] &&
  //         queryKeyFetched[1] == queryKey[1] &&
  //         queryKeyFetched[2] == queryKey[2];

  //       if (!tableFilter) return false;

  //       const filters = queryKeyFetched[3] as string[];
  //       // console.log({ filters });

  //       const final = filters.reduce((acc: boolean, filter: string) => {
  //         const parts = filter.split("=");
  //         const operatorAndData = parts[1].split(".");

  //         const key = parts[0];
  //         const operator = operatorAndData[0];
  //         const data = operatorAndData[1];

  //         // console.log(key, operator, data);
  //         switch (operator) {
  //           case "eq":
  //             return acc && newData[key] === data;
  //         }

  //         return acc;
  //       }, true);

  //       // console.log(filters, final);

  //       return final;
  //     },
  //   },
  //   (oldData: any) => {
  //     // console.log(oldData);
  //     const cachedData = oldData.data;
  //     const isArray = Array.isArray(cachedData);
  //     let updatedData: D[] | D | null = null;
  //     switch (true) {
  //       case isArray && newData.is_deleted:
  //         updatedData = cachedData.filter((d: any) => d.id !== newData.id);
  //         break;
  //       case !isArray && newData.is_deleted:
  //         updatedData = null;
  //         break;
  //       case !isArray:
  //         updatedData = newData;
  //         break;
  //       case isArray:
  //         updatedData = cachedData;
  //         const find = updatedData.findIndex((d) => d.id == newData.id);
  //         // console.log(find);
  //         if (find !== -1) {
  //           updatedData[find] = newData;
  //         } else {
  //           if (addFirst) updatedData.unshift(newData);
  //           else updatedData.push(newData);
  //         }
  //         break;
  //     }
  //     console.log({ updatedData, cachedData });

  //     return { ...oldData, data: updatedData };
  //   }
  // );
};
