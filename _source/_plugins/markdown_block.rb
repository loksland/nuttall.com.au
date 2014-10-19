# Markdown blocks inside html templates
#
# Usage:
# ========================================================================================
# {% markdown %}
# [Stack Overflow](http://www.stackoverflow.com)
# {% endmarkdown %}
# ========================================================================================
#
# Requires kramdown Ruby gem
# 
# Source:
# http://stackoverflow.com/questions/15917463/embedding-markdown-in-jekyll-html

module Jekyll
  class MarkdownBlock < Liquid::Block
    def initialize(tag_name, text, tokens)
      super
    end
    require "kramdown"
    def render(context)
      content = super
      "#{Kramdown::Document.new(content).to_html}"
    end
  end
end
Liquid::Template.register_tag('markdown', Jekyll::MarkdownBlock)