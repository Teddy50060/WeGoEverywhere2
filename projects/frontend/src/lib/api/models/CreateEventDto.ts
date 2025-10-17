/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateEventDto = {
    name?: string;
    cost?: number;
    date?: string;
    time?: string;
    place?: string;
    capacity?: number;
    detail?: string;
    rating?: number;
    userId?: number;
    /**
     * Must have at least 1 category
     */
    categories?: Array<string>;
    imagePath?: string;
    status?: string;
    /**
     * Image file to upload
     */
    file?: Blob;
};

