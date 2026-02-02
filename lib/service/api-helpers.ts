// src/lib/service/api-helpers.ts

import BaseService from "@/lib/service/BaseService";
import { httpMethods } from "@/lib/service/HttpService";
import { toast } from "@/hooks/use-toast";


interface status401Body {
  status: 401;
  message: string;
  raw?: status401raw;
}

interface status401raw {
  error: string
  message: string
  tokenExpired: boolean
}



interface ApiOperationConfig<T> {
  url: string;
  method: keyof typeof httpMethods;
  body?: any;
  setLoading: (loading: boolean) => void;
  successMessage?: string;
  errorMessagePrefix?: string;
  successToastTitle?: string;
  errorToastTitle?: string;
}

export async function apiCall<T>(config: ApiOperationConfig<T>): Promise<T | null> {
  const {
    url,
    method,
    body,
    setLoading,
    successMessage,
    errorMessagePrefix = "Operation failed",
    successToastTitle,
    errorToastTitle,
  } = config;

  setLoading(true);

  try {
    // console.log("url : " + url)
    // console.log("method : " + method)
    // console.log("body : ")
    // console.log(body)
    const response: T = await BaseService.request(url, { method, body });

    /*
    if (successMessage) {
      toast({
        title: successToastTitle || "Success",
        description: successMessage,
        variant: "default",
        duration: 2000, // 2 seconds
      });
    }
*/
    return response;
  } catch (error: any) {
    console.error(`${errorMessagePrefix}:`, error);

    const errorMessage = error.message || "An unexpected error occurred.";

    let displayErrorTitle = errorToastTitle || errorMessagePrefix;
    let displayErrorDescription = errorMessage;

    if (error.status === 400) {
      displayErrorTitle = "Bad Request (400)";
      displayErrorDescription = error.message || "Bad Request";
    } else if (error.status === 401) {
      console.log("error 401 catch : ")
      console.log(error)
      let body: status401Body = error;
      if (body && body.raw) {
        if (body.raw.tokenExpired) {



          displayErrorTitle = "Session Expired (401)";
          displayErrorDescription = "Your session has expired. Please log in again. " + body.raw.message || "";
        } else {

          displayErrorTitle = "Unauthorized (401)";
          displayErrorDescription = body.raw.message || "You are not authorized to perform this action.";
        }
      } else {
        displayErrorTitle = "Unauthorized (401)";
        displayErrorDescription = error.message || "You are not authorized to perform this action.";
      }


    } else if (error.status === 500) {
      displayErrorTitle = "Server Error (500)";
      displayErrorDescription = "There was a server error. Please try again later.";
    }

    toast({
      title: displayErrorTitle + " " + url,
      description: displayErrorDescription,
      variant: "destructive",
      duration: 20000, // 2 seconds
    });

    return null;
  } finally {
    setLoading(false);
  }
}

export interface FetchEntitiesOptions {
  setLoading: (loading: boolean) => void;
}

