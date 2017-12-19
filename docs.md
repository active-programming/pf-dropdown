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

#### Off Topic

YWU rule

if You really Want to Understand - You Will Understand<br>
or<br>
You Want to Understand - You Will understand