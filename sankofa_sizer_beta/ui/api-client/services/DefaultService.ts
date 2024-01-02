/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImageWithBodyParts } from '../models/ImageWithBodyParts';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * Authenticates users and returns a JWT token
     * @param requestBody
     * @returns any Login successful
     * @throws ApiError
     */
    public static postLogin(
        requestBody: {
            username?: string;
            password?: string;
        },
    ): CancelablePromise<{
        /**
         * JWT token for session authentication
         */
        token?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Uploads multiple images for processing with optional text notes
     * @param formData
     * @returns any Images and notes uploaded successfully
     * @throws ApiError
     */
    public static postUploadImages(
        formData: {
            imagesWithBodyParts?: Array<ImageWithBodyParts>;
            /**
             * Optional text notes related to the images
             */
            notes?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload-images',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * Notifies other users about projects involving specific anthropometric measurements
     * @param requestBody
     * @returns any Users notified successfully
     * @throws ApiError
     */
    public static postNotifyUsers(
        requestBody: {
            /**
             * Identifier of the project
             */
            projectId?: string;
            /**
             * Notification message to be sent
             */
            message?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/notify-users',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Selects or deselects images for processing and assigns primary body parts
     * @param requestBody
     * @returns any Image selections updated successfully
     * @throws ApiError
     */
    public static postChooseImages(
        requestBody: {
            imageSelections?: Array<{
                /**
                 * Unique identifier for the image
                 */
                imageId?: string;
                /**
                 * Indicates whether the image is selected for processing
                 */
                isSelected?: boolean;
                bodyPartsRepresented?: Array<ImageWithBodyParts>;
            }>;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/choose-images',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Selects algorithms for body part/entire body creation
     * @param requestBody
     * @returns any Algorithms selected successfully
     * @throws ApiError
     */
    public static postChooseAlgorithms(
        requestBody: {
            /**
             * List of algorithms to use for processing
             */
            algorithms?: Array<string>;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/choose-algorithms',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Gets the status of the processing and download URL
     * @returns any Processing status and download URL
     * @throws ApiError
     */
    public static getDownloadStatus(): CancelablePromise<{
        kind?: 'mesh' | 'point cloud' | 'depth map';
        status?: 'notStarted' | 'pending' | 'finished';
        /**
         * URL for the outputs, available if status is 'finished'
         */
        downloadUrl?: string | null;
        bodyPartsRepresented?: Array<ImageWithBodyParts>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/download-status',
        });
    }

}
