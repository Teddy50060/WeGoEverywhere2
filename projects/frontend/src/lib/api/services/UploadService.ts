/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileUploadResponseDto } from '../models/FileUploadResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UploadService {
    /**
     * Upload a single file
     * @param formData The file to upload
     * @returns FileUploadResponseDto File has been successfully uploaded.
     * @throws ApiError
     */
    public static uploadControllerUploadImage(
        formData: {
            file?: Blob;
        },
    ): CancelablePromise<FileUploadResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload/upload_single_file',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Bad Request. No file provided.`,
            },
        });
    }
}
