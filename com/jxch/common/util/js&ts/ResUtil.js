var ResUtil;
(function (ResUtil) {
    var State;
    (function (State) {
        State[State["failure"] = -1] = "failure";
        State[State["default"] = 0] = "default";
        State[State["finally"] = 1] = "finally";
        State[State["error"] = 100] = "error";
        State[State["success"] = 200] = "success";
        State[State["invalidToken"] = 10014] = "invalidToken";
    })(State || (State = {}));
    function support(resProcessor, stateCode) {
        return resProcessor[State[stateCode]] !== undefined;
    }
    function execute(resProcessor, stateCode) {
        resProcessor[State[stateCode]]();
    }
    function tryExecute(resProcessor, stateCode) {
        if (support(resProcessor, stateCode)) {
            execute(resProcessor, stateCode);
            return true;
        }
        return false;
    }
    function process(res, resProcessor, useDefaultProcessor) {
        if (useDefaultProcessor === void 0) { useDefaultProcessor = true; }
        if (support(resProcessor, res.state)) {
            execute(resProcessor, res.state);
        }
        else {
            tryExecute(resProcessor, State.default);
            if (res.state !== State.success) {
                tryExecute(resProcessor, State.failure);
            }
            if (useDefaultProcessor) {
                process(res, new DefaultResProcessor(res), false);
            }
        }
        tryExecute(resProcessor, State.finally);
    }
    ResUtil.process = process;
    var DefaultResProcessor = /** @class */ (function () {
        function DefaultResProcessor(res) {
            this.res = res;
        }
        DefaultResProcessor.prototype.error = function () {
            this.log();
        };
        DefaultResProcessor.prototype.success = function () {
            this.log();
        };
        DefaultResProcessor.prototype.failure = function () {
            console.log(new Date().toLocaleString() + "[" + State[State.failure] + "]");
            console.log(this.res);
        };
        DefaultResProcessor.prototype.log = function () {
            console.log(new Date().toLocaleString() + " [" + State[this.res.state] + "] " + this.res.message + ". \nData:");
            console.log(this.res.data);
        };
        return DefaultResProcessor;
    }());
})(ResUtil || (ResUtil = {}));
