const initialState = {
    products: null,
    categories: null,
    pagination: {},
};

const updatePagination = (action) => ({
    pageNumber: action.pageNumber,
    pageSize: action.pageSize,
    totalElements: action.totalElements,
    totalPages: action.totalPages,
    lastPage: action.lastPage,
});

export const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_PRODUCTS":
            return {
                // ...state keep all the immutability
                ...state,
                products: action.payload,
                pagination: {
                    ...state.pagination,
                    ...updatePagination(action)
                }
            };
    
        case "FETCH_CATEGORIES":
            return {
                ...state,
                categories: action.payload,
                pagination: {
                    ...state.pagination,
                    ...updatePagination(action)
                }
            };
    
        default:
            return state;
    }
};