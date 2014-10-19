nuttall.com.au
==============

Source of folio site for Lachlan Nuttall.

**Making a comment**

```
{% comment %}
<!--
Some commented stuff
-->
{% endcomment %}
```

Also all standard html comments will be removed when distributed.

**Embedding markdown**

```
{% markdown %}

##Inline markdown###

Is *here*

{% endmarkdown %}
```

**Environment conditionals**

Everything between `<!--ifdev:start-->` and `<!--ifdev:end-->` will *only* be present in
dev environment.

Everything between `<!--ifdist:start` and `ifdist:end-->` will *only* be present in the
dist environment.

Example:
```
<!--ifdev:start-->
<script src="/js/common.js"></script>
<!--ifdev:end-->
<!--ifdist:start
<script src="/js/common.min.js"></script>
ifdist:end-->
```

Reference
---------

[Liquid for designers](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers)

