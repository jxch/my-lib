var ResUtil;
(function (ResUtil) {
    var State;
    (function (State) {
        State[State["error"] = 100] = "error";
        State[State["success"] = 200] = "success";
    })(State || (State = {}));
    function process(resProcessor) {
        try {
            return resProcessor[State[resProcessor.state]]();
        }
        catch (e) {
            return new DefaultResProcessor(resProcessor.state, resProcessor.data)[State[resProcessor.state]]();
        }
    }
    ResUtil.process = process;
    var DefaultResProcessor = /** @class */ (function () {
        function DefaultResProcessor(state, data) {
            this.state = state;
            this.data = data;
        }
        DefaultResProcessor.prototype.error = function () {
            this.log();
        };
        DefaultResProcessor.prototype.success = function () {
            this.log();
        };
        DefaultResProcessor.prototype.log = function () {
            console.log(new Date().toLocaleString() + ":[" + State[this.state] + "] Data on the next line:");
            console.log(this.data);
        };
        return DefaultResProcessor;
    }());
})(ResUtil || (ResUtil = {}));
