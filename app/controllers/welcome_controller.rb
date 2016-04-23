class WelcomeController < ApplicationController
  def index 
    cookies.permanent[:csgender] = params[:gender]
    cookies.permanent[:csage] = params[:age]
  end
end
