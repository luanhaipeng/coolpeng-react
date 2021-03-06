import { isPromise } from '../utils';

const defaultTypes = ['PENDING', 'SUCCESS', 'ERROR'];

export default function promiseMiddleware(config = {}) {
    const promiseTypeSuffixes = config.promiseTypeSuffixes || defaultTypes;

    return (_ref) => {
        const dispatch = _ref.dispatch;

        return next => action => {
            if (!isPromise(action.payload)) {
                return next(action);
            }

            const { type, payload, meta } = action;
            const { promise, data } = payload;
            const [ PENDING, SUCCESS, ERROR ] = (meta || {}).promiseTypeSuffixes || promiseTypeSuffixes;
            const actionSourceCallback = (meta || {}).actionSourceCallback || function () {
                };

            /**
             * Dispatch the first async handler. This tells the
             * reducer that an async action has been dispatched.
             */
            next({
                type: `${type}_${PENDING}`,
                ...!!data ? {payload: data} : {},
                ...!!meta ? {meta} : {}
            });

            const isAction = resolved => resolved && (resolved.meta || resolved.payload);
            const isThunk = resolved => typeof resolved === 'function';
            const getResolveAction = isError => ({
                type: `${type}_${isError ? ERROR : SUCCESS}`,
                ...!!meta ? {meta} : {},
                ...!!isError ? {error: true} : {}
            });

            /**
             * Re-dispatch one of:
             *  1. a thunk, bound to a resolved/rejected object containing ?meta and type
             *  2. the resolved/rejected object, if it looks like an action, merged into action
             *  3. a resolve/rejected action with the resolve/rejected object as a payload
             */
            action.payload.promise = promise.then(
                (resolved = {}) => {
                    const resolveAction = getResolveAction();
                    return dispatch(isThunk(resolved) ? resolved.bind(null, resolveAction) : {
                        ...resolveAction,
                        ...isAction(resolved) ? resolved : {...!!resolved && {payload: resolved}}
                    });
                },
                (rejected = {}) => {
                    const resolveAction = getResolveAction(true);
                    return dispatch(isThunk(rejected) ? rejected.bind(null, resolveAction) : {
                        ...resolveAction,
                        ...isAction(rejected) ? rejected : {...!!rejected && {payload: rejected}}
                    });
                }
            ).then(function (resolved) {
                actionSourceCallback(resolved, resolved.payload);
            }, function (rejected) {
                actionSourceCallback(rejected, rejected.payload);
            });

            return action;
        };
    };
}
