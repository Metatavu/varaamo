import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import schemas from 'middleware/Schemas';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from 'utils/APIUtils';

function fetchResource(id, params = {}) {
  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.API.RESOURCE_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.RESOURCE_GET_SUCCESS,
          { schema: schemas.resourceSchema }
        ),
        getErrorTypeDescriptor(types.API.RESOURCE_GET_ERROR),
      ],
      endpoint: buildAPIUrl(`resource/${id}`, params),
      method: 'GET',
      headers: getHeadersCreator(),
    },
  };
}

function fetchResources(params = {}, source) {
  const fetchParams = Object.assign({}, params, { pageSize: 100 });

  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.API.RESOURCES_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.RESOURCES_GET_SUCCESS,
          {
            meta: { source },
            schema: schemas.paginatedResourcesSchema,
          }
        ),
        getErrorTypeDescriptor(types.API.RESOURCES_GET_ERROR),
      ],
      endpoint: buildAPIUrl('resource', fetchParams),
      method: 'GET',
      headers: getHeadersCreator(),
      bailout: (state) => !state.api.shouldFetch.resources,
    },
  };
}

function favoriteResource(id) {
  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.API.RESOURCE_FAVORITE_POST_REQUEST),
        getSuccessTypeDescriptor(types.API.RESOURCE_FAVORITE_POST_SUCCESS),
        getErrorTypeDescriptor(types.API.RESOURCE_FAVORITE_POST_ERROR),
      ],
      endpoint: buildAPIUrl(`resource/${id}/favorite`),
      method: 'POST',
      headers: getHeadersCreator(),
    },
  };
}

function unfavoriteResource(id) {
  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.API.RESOURCE_UNFAVORITE_POST_REQUEST),
        getSuccessTypeDescriptor(types.API.RESOURCE_UNFAVORITE_POST_SUCCESS),
        getErrorTypeDescriptor(types.API.RESOURCE_UNFAVORITE_POST_ERROR),
      ],
      endpoint: buildAPIUrl(`resource/${id}/unfavorite`),
      method: 'POST',
      headers: getHeadersCreator(),
    },
  };
}


export {
  fetchResource,
  fetchResources,
  favoriteResource,
  unfavoriteResource,
};
