module ApplicationHelper

  def link_to_unless_with_block condition, name, options = {}, html_options = {}, &block
    if condition
      capture &block
    else
      link_to options, html_options, &block
    end
  end

end
