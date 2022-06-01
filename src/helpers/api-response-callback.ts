export interface ApiResponseCallback {
    onSuccess(response: any): any;
    onError(errorCode: number, errorMessage: string): any;
}