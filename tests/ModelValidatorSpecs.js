describe("Model validator tests", function () {
    
    beforeEach(module('angularModelValidator'));

    var model = {
        test: null,
        val2: null
    };

    describe("When no rule set exists for the model", function () {
        it("returns no errors", inject(function (ModelValidator) {
            var results = ModelValidator.validate(model);
            expect(results).toBe(null);
        })); 
    });

    describe("When a model has validation rules", function () {

        var modelValidator;

        beforeEach(inject(function (ModelValidator) {
            modelValidator = ModelValidator;
            modelValidator.addRuleSet(model, { test: { presence: true } });
        }));

        describe("and there are no errors", function () {

            beforeEach(function () {
                model.test = "Value";
            });

            it("returns no errors", function () {
                var results = modelValidator.validate(model);
                expect(results).toBe(null);
            });
        });
        describe("and there are validation errors", function () {
            beforeEach(function () {
                model.test = "";
            });

            it("returns the expected error", function () {
                var results = modelValidator.validate(model);
                expect(results).toEqual({ test: [ "Test can't be blank" ] });
            });

            describe("and another model has been configured", function () {
                it("returns errors for the model being validated", function () {
                    modelValidator.addRuleSet({}, { val2: { presence: true } });
                    var results = modelValidator.validate(model);
                    expect(results).toEqual({ test: ["Test can't be blank"] });
                });
            });
        });
    });
});