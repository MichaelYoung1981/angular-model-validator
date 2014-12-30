describe("Validate and Submit Directive tests", function () {
    
    var validator, form;

    beforeEach(function () {
        module('angularModelValidator');
        
        inject(function ($injector) {
            validator = $injector.get("ModelValidator");
        });
    });

    describe("when a model is specified", function () {

        var controller, model;

        beforeEach(inject(function ($rootScope, $compile) {
            model = { Name: "" }
            validator.addRuleSet(model, { Name: { presence: true } });
            form = angular.element("<form validate-and-submit='test.submit()' model-to-validate='model'></form>");
            controller = createController($rootScope, $compile, model);
        }));

        it("is used for validation", function () {
            form.triggerHandler("submit");
            expect(controller.errorMessages.Name).toBeTruthy();
        });
    });

    describe("when a model is not specified", function () {
        var controller, model;

        beforeEach(inject(function ($rootScope, $compile) {
            model = $rootScope;
            model.Test = "";
            validator.addRuleSet(model, { Test: { presence: true } });
            form = angular.element("<form validate-and-submit='test.submit()'></form>");
            controller = createController($rootScope, $compile, model);
        }));

        it("is used for validation", function () {
            form.triggerHandler("submit");
            expect(controller.errorMessages.Test).toBeTruthy();
        });
    });

    describe("when validation fails", function () {

        var controller, model;

        beforeEach(inject(function ($rootScope, $compile) {
            model = { Name: "" }
            validator.addRuleSet(model, { Name: { presence: true } });
        }));

        describe("when errors should be displayed in the error message panel", function () {
            beforeEach(inject(function ($rootScope, $compile) {
                form = angular.element("<form validate-and-submit='test.submit()' model-to-validate='model' validation-error-summary='true'></form>");
                controller = createController($rootScope, $compile, model);
            }));

            it("displays the errors", function () {
                form.triggerHandler("submit");
                expect(form.html()).toContain("<li ng-repeat=\"error in group\" class=\"ng-binding ng-scope\">Name can't be blank</li>");
            });
        });
        describe("When errors should be displayed by the field", function () {
            beforeEach(inject(function ($rootScope, $compile) {
                form = angular.element("<form validate-and-submit='test.submit()' model-to-validate='model' validation-error-summary='false'></form>");
                var input = angular.element("<input type='text' ng-model='model.Name' />");
                form.append(input);
                controller = createController($rootScope, $compile, model);
            }));

            it("displays the errors", function () {
                form.triggerHandler("submit");
                expect(form.html()).toContain("<input type=\"text\" ng-model=\"model.Name\" class=\"ng-pristine ng-untouched ng-valid\"><!-- ngRepeat: error in validatorController.errorMessages['Name'] --><div ng-repeat=\"error in validatorController.errorMessages['Name']\" class=\"ng-binding ng-scope\">Name can't be blank</div>");
            });
        });
    });

    describe("when validation succeeds", function () {
        var controller, model, successCalled;

        beforeEach(inject(function ($rootScope, $compile) {
            $rootScope.submit = function () { successCalled = true };
            successCalled = false;
            form = angular.element("<form validate-and-submit='submit()' model-to-validate='model' validation-error-summary='false'></form>");
            controller = createController($rootScope, $compile, model);
        }));

        it("calls the success function", function () {
            form.triggerHandler("submit");
            expect(successCalled).toBe(true);
        });
    });

    function createController($rootScope, $compile, model) {
        var $scope = $rootScope;
        $scope.model = model || {};
        $compile(form)($scope);
        $scope.$digest();
        return form.isolateScope().validatorController;
    }
});