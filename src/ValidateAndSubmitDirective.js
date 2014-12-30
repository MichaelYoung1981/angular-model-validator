(function () {
    angular.module('angularModelValidator').directive('validateAndSubmit', ValidateAndSubmitDirective);

    ValidateAndSubmitDirective.$inject = ['$compile', '$parse'];

    function ValidateAndSubmitDirective($compile, $parse) {
        return {
            restrict: 'A',
            controller: ValidateAndSubmitController,
            controllerAs: "validatorController",
            scope: {
                model: '=modelToValidate'
            },
            link: link,
            priority: 1
        }

        function link(scope, element, attrs) {
            var successFunction = $parse(attrs["validateAndSubmit"], null, true);
            
            bindErrors(scope, element, attrs);
            captureSubmit(scope, element, successFunction);
        }

        function bindErrors(scope, element, attrs) {
            if (attrs["validationErrorSummary"] && attrs["validationErrorSummary"] !== "false") {
                addErrorContainer(scope, element);
            }
            else {
                addFieldErrors(scope, element, attrs);
            }
        }

        function addErrorContainer(scope, element) {
            var errorElement = angular.element("<ul ng-repeat='group in validatorController.errorMessages'><li ng-repeat='error in group'>{{error}}</li></ul>");
            var compiled = $compile(errorElement);
            element.prepend(errorElement);
            compiled(scope);
        }

        function addFieldErrors(scope, element, attrs) {
            var modelName = ""
            if (attrs["modelToValidate"]) {
                modelName = attrs["modelToValidate"] + ".";
            }
            var model = scope.model || scope;
            Object.keys(model).forEach(function (property) {
                var matchingInput = element.find("[ng-model='" + modelName + property + "']");
                addErrorMessage(matchingInput, property, scope);
            });
        }

        function addErrorMessage(matchingInput, property, scope) {
            var messageElement = angular.element("<div ng-repeat=\"error in validatorController.errorMessages['" + property + "']\">{{error}}</div>");
            var compiled = $compile(messageElement);
            matchingInput.after(messageElement);
            compiled(scope);
        }

        function captureSubmit(scope, element, successFunction) {
            element.on('submit', function () { scope.validatorController.validate(scope.model || scope.$parent, successFunction); });
        }
    }

    ValidateAndSubmitController.$inject = ['ModelValidator', '$scope'];

    function ValidateAndSubmitController(ModelValidator, $scope) {
        this.validate = validate;

        function validate(theModel, successFunction) {
            this.errorMessages = ModelValidator.validate(theModel);
            $scope.$apply();
            if (!this.errorMessages) {
                successFunction($scope.$parent);
            }
        }
    }
})();