PF Dropdown
===========


DRAFT
-----


You need to have jQuery imported as global object!

webpack.config.js
```
    ...
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
    ]
    ...
```