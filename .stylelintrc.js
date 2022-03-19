module.exports = {
    plugins: [
        'stylelint-scss'
    ],
    extends: [
        'stylelint-config-standard',
        'stylelint-config-recess-order',
    ],
    ignoreFiles: [
        '/node_modules',
        '/dist',
    ],
    rules: {
        'indentation': 'tab',
        //禁止未知单位
        'unit-no-unknown': [true, {
            ignoreUnits: ['rpx']
        }],
        // "unit-whitelist": ["em", "rem", "%", "s", "px", "upx", "rpx"],
        // 颜色值要大写
        'color-hex-case': 'upper',
        // 颜色值能短则短
        'color-hex-length': 'short',
        "max-empty-lines": 2,
        'max-line-length': 50,
        'no-eol-whitespace': true,
        'no-missing-end-of-source-newline': null,

        'font-family-no-missing-generic-family-keyword': null,
        'no-descending-specificity': null,
        // 不能用important
        'declaration-no-important': true,
        'rule-empty-line-before': 'never',
        'selector-pseudo-element-no-unknown': [true, {
            ignorePseudoElements: ['v-deep']
        }],
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true
    }
}
