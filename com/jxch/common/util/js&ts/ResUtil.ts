module ResUtil {
    enum State {
        failure = -1,
        default = 0,
        finally = 1,
        error = 100,
        success = 200,
        invalidToken = 10014,
    }

    export interface Res<T> {
        readonly state: number;
        readonly message: String;
        readonly data?: T;
    }

    export interface ResProcessor {
        success?();

        error?();

        failure?();

        default?();

        finally?();

        invalidToken?();
    }

    function support(resProcessor: ResProcessor, stateCode: State) {
        return resProcessor[State[stateCode]] !== undefined;
    }

    function execute(resProcessor: ResProcessor, stateCode: State) {
        resProcessor[State[stateCode]]();
    }

    function tryExecute(resProcessor: ResProcessor, stateCode: State) {
        if (support(resProcessor, stateCode)) {
            execute(resProcessor, stateCode);
            return true;
        }
        return false;
    }

    export function process<T>(res: Res<T>, resProcessor: ResProcessor, useDefaultProcessor: Boolean = true) {
        if (support(resProcessor, res.state)) {
            execute(resProcessor, res.state);
        } else {
            tryExecute(resProcessor, State.default);
            if (res.state !== State.success) {
                tryExecute(resProcessor, State.failure);
            }

            if (useDefaultProcessor){
                process(res, new DefaultResProcessor(res), false);
            }
        }

        tryExecute(resProcessor, State.finally);
    }

    class DefaultResProcessor<T> implements ResProcessor {
        readonly res: Res<T>;

        constructor(res: Res<T>) {
            this.res = res;
        }

        error() {
            this.log();
        }

        success() {
            this.log();
        }

        failure() {
            console.log(new Date().toLocaleString() + "[" + State[State.failure] + "]");
            console.log(this.res);
        }

        log() {
            console.log(new Date().toLocaleString() + " [" + State[this.res.state] + "] " + this.res.message + ". \nData:");
            console.log(this.res.data);
        }
    }
}
