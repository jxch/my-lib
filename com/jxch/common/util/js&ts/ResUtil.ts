module ResUtil {
    enum State {
        error = 100,
        success = 200
    }

    export interface ResProcessor<T> {
        readonly state: number;
        readonly data?: T;

        success?();

        error?();
    }

    export function process<T>(resProcessor: ResProcessor<T>) {
        try {
            return resProcessor[State[resProcessor.state]]();
        } catch (e) {
            return new DefaultResProcessor(resProcessor.state, resProcessor.data)[State[resProcessor.state]]();
        }
    }

    class DefaultResProcessor<T> implements ResProcessor<T> {
        readonly state: number;
        readonly data?: T;

        constructor(state: number, data?: T) {
            this.state = state;
            this.data = data;
        }

        error() {
            this.log();
        }

        success() {
            this.log();
        }

        log() {
            console.log(new Date().toLocaleString() + ":[" + State[this.state] + "] Data on the next line:");
            console.log(this.data);
        }
    }
}
