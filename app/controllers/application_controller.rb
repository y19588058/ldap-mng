class ApplicationController < ActionController::Base
  #protect_from_forgery with: :exception
  #protect_from_forgery with: :null_session

  def clear_flash
    flash[:notice]=nil
    flash[:alert]=nil
    flash[:error]=nil
  end

end
