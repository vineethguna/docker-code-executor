var _ = require('lodash');
var format = require('util').format;
var executorMapper = require('../../../../modules/codeexecutors/executorMapper');

describe('modules/codeexecutors/executorMapper.js', function(){
    var validLanguages, languageExtensionMap;

    beforeAll(function(){
        languageExtensionMap = {
            'c': '.c',
            'python': '.py',
            'ruby': '.rb'
        };

        validLanguages = ['c', 'python', 'ruby'];
    });

    it('should be an object', function(){
        expect(typeof executorMapper).toBe('object');
    });

    it('should have keys same as validLanguages', function(){
        var keys = _.keys(executorMapper);
        expect(keys.length).toBe(validLanguages.length);
        expect(_.difference(keys, validLanguages)).toEqual([]);
    });

    it('should contain a mapper from language to respective language executor class', function(){
        _.forEach(executorMapper, function(value, key){
            expect(value.executorModule).toBe(require(format('../../../../modules/codeexecutors/%sExecutor', key)));
        });
    });

    it('should have the respective extensions', function(){
        _.forEach(languageExtensionMap, function(value, key){
            expect(executorMapper[key].extension).toBe(value);
        })
    })
});