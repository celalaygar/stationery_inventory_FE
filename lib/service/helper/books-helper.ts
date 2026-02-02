
import { Category } from "@/lib/slices/categoriesSlice";
import { apiCall, FetchEntitiesOptions } from "../api-helpers";
import {
    BOOK_URL
} from "../BasePath";
import { httpMethods } from "../HttpService";
import { CategoryResponse } from "@/lib/model/category";
import { Book, BookSaveRequest, PagedResponse } from "@/lib/slices/booksSlice";

export const getBooksByPaginationHelper = async (bookPageRequest: BookPageRequest, options: FetchEntitiesOptions): Promise<PagedResponse<Book> | null> => {
    return apiCall<PagedResponse<Book>>({
        url: BOOK_URL + "/search",
        method: httpMethods.POST,
        body: bookPageRequest,
        setLoading: options.setLoading,
        successMessage: `Books have been retrieved.`,
        errorMessagePrefix: "Failed to load books",
        successToastTitle: "Books Loaded",
        errorToastTitle: "Error Loading Books",
    });
}




export const getBooksHelper = async (options: FetchEntitiesOptions): Promise<Book[] | null> => {
    return apiCall<Book[]>({
        url: `${BOOK_URL}`,
        method: httpMethods.GET,
        setLoading: options.setLoading,
        successMessage: `Books have been retrieved.`,
        errorMessagePrefix: "Failed to load books",
        successToastTitle: "Books Loaded",
        errorToastTitle: "Error Loading Books",
    });
}

export const getBookHelper = async (bookId: string, options: FetchEntitiesOptions): Promise<Book | null> => {
    if (!bookId) {
        options.setLoading(false);
        return null;
    }
    return apiCall<Book>({
        url: `${BOOK_URL}/${bookId}`,
        method: httpMethods.GET,
        setLoading: options.setLoading,
        successMessage: `Book ${bookId} has been retrieved.`,
        errorMessagePrefix: "Failed to load book",
        successToastTitle: "Book Loaded",
        errorToastTitle: "Error Loading Book",
    });
}

export const saveBookHelper = async (bookData: BookSaveRequest, options: FetchEntitiesOptions): Promise<Book | null> => {
    return apiCall<Book>({
        url: BOOK_URL,
        method: httpMethods.POST,
        body: bookData,
        setLoading: options.setLoading,
        successMessage: "Book has been successfully saved.",
        errorMessagePrefix: "Failed to save book",
        successToastTitle: "Book Saved",
        errorToastTitle: "Error Saving Book",
    });
}
export const updateBookHelper = async (bookId: string, bookData: BookSaveRequest, options: FetchEntitiesOptions): Promise<Book | null> => {
    return apiCall<Book>({
        url: `${BOOK_URL}/${bookId}`,
        method: httpMethods.PUT,
        body: bookData,
        setLoading: options.setLoading,
        successMessage: `Book ${bookId} has been successfully updated.`,
        errorMessagePrefix: "Failed to update book",
        successToastTitle: "Book Updated",
        errorToastTitle: "Error Updating Book",
    });
}

export const deleteBookHelper = async (bookId: string, options: FetchEntitiesOptions): Promise<boolean | null> => {
    return apiCall<boolean>({
        url: `${BOOK_URL}/${bookId}`,
        method: httpMethods.DELETE,
        setLoading: options.setLoading,
        successMessage: `Book ${bookId} has been successfully deleted.`,
        errorMessagePrefix: "Failed to delete book",
        successToastTitle: "Book Deleted",
        errorToastTitle: "Error Deleting Book",
    });
}

export const getBookTotalCountHelper = async (options: FetchEntitiesOptions): Promise<number | null> => {
    return apiCall<number>({
        url: `${BOOK_URL}/total-count`,
        method: httpMethods.GET,
        setLoading: options.setLoading,
        successMessage: `Total book count has been retrieved.`,
        errorMessagePrefix: "Failed to load total book count",
        successToastTitle: "Total Book Count Loaded",
        errorToastTitle: "Error Loading Total Book Count",
    });
}

export const getTotalPriceHelper = async (options: FetchEntitiesOptions): Promise<number | null> => {
    return apiCall<number>({
        url: `${BOOK_URL}/total-price`,
        method: httpMethods.GET,
        setLoading: options.setLoading,
        successMessage: `Total book price has been retrieved.`,
        errorMessagePrefix: "Failed to load total book price",
        successToastTitle: "Total Book Price Loaded",
        errorToastTitle: "Error Loading Total Book Price",
    });
}