
import { Category } from "@/lib/slices/categoriesSlice";
import { apiCall, FetchEntitiesOptions } from "../api-helpers";
import {
    CATEGORY_URL
} from "../BasePath";
import { httpMethods } from "../HttpService";
import { CategoryResponse } from "@/lib/model/category";




export const getCategoryHelper = async (categoryId: string, options: FetchEntitiesOptions): Promise<CategoryResponse | null> => {
    if (!categoryId) {
        options.setLoading(false);
        return null;
    }

    return apiCall<CategoryResponse>({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: httpMethods.GET,
        setLoading: options.setLoading,
        successMessage: `Category ${categoryId} has been retrieved.`,
        errorMessagePrefix: "Failed to load category",
        successToastTitle: "Category Loaded",
        errorToastTitle: "Error Loading Category",
    });
};



export const getCategoriesHelper = async (options: FetchEntitiesOptions): Promise<Category[] | null> => {
    return apiCall<Category[]>({
        url: `${CATEGORY_URL}`,
        method: httpMethods.GET,
        setLoading: options.setLoading,
        successMessage: `Categories have been retrieved.`,
        errorMessagePrefix: "Failed to load categories",
        successToastTitle: "Categories Loaded",
        errorToastTitle: "Error Loading Categories",
    });
}


export const getCategoriesByTypeHelper = async (type: string, options: FetchEntitiesOptions): Promise<Category[] | null> => {
    return apiCall<Category[]>({
        url: `${CATEGORY_URL}/type/${type}`,
        method: httpMethods.GET,
        setLoading: options.setLoading,
        successMessage: `Categories of type ${type} have been retrieved.`,
        errorMessagePrefix: "Failed to load categories by type",
        successToastTitle: "Categories Loaded",
        errorToastTitle: "Error Loading Categories",
    });
}

export const getCategoriesCountByTypeHelper = async (type: string, options: FetchEntitiesOptions): Promise<number | null> => {
    return apiCall<number>({
        url: `${CATEGORY_URL}/count/${type}`,
        method: httpMethods.GET,
        setLoading: options.setLoading,
        successMessage: `Category count of type ${type} has been retrieved.`,
        errorMessagePrefix: "Failed to load category count by type",
        successToastTitle: "Category Count Loaded",
        errorToastTitle: "Error Loading Category Count",
    });
}

export const updateCategoryStatusHelper = async (categoryId: string, isActive: boolean, options: FetchEntitiesOptions): Promise<Category | null> => {
    return apiCall<Category | null>({
        url: `${CATEGORY_URL}/${categoryId}/status`,
        method: httpMethods.PATCH,
        body: { active: isActive },
        setLoading: options.setLoading,
        successMessage: `Category status has been updated.`,
        errorMessagePrefix: "Failed to update category status",
        successToastTitle: "Category Status Updated",
        errorToastTitle: "Error Updating Category Status",
    });
}


export const updateCategoryHelper = async (categoryId: string, categoryData: Category, options: FetchEntitiesOptions): Promise<Category | null> => {
    return apiCall<Category>({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: httpMethods.PUT,
        body: categoryData,
        setLoading: options.setLoading,
        successMessage: "Category has been successfully updated.",
        errorMessagePrefix: "Failed to update category",
        successToastTitle: "Category Updated",
        errorToastTitle: "Error Updating Category",
    });
}


export const createCategoryHelper = async (categoryData: Category, options: FetchEntitiesOptions): Promise<Category | null> => {
    return apiCall<Category>({
        url: CATEGORY_URL,
        method: httpMethods.POST,
        body: categoryData,
        setLoading: options.setLoading,
        successMessage: "Category has been successfully created.",
        errorMessagePrefix: "Failed to create category",
        successToastTitle: "Category Created",
        errorToastTitle: "Error Creating Category",
    });
}

