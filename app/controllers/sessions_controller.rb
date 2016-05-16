class SessionsController < ApplicationController
  def new
  end

  def create
    user = User.find_by_email(params[:email].downcase)
    if user && user.authenticate(params[:password])
      # login user
      session[:user_id] = user.id
      
      #if params[:session][:remember_me] == '1' 
	# remember user
        user.remember
        cookies.permanent.signed[:user_id] = user.id
        cookies.permanent[:remember_token] = user.remember_token
      #else
#	user.forget
      #end
      
      redirect_to '/cs'
    else
      render :new
    end
  end

  def destroy
    current_user.forget 
    cookies.delete(:user_id)
    cookies.delete(:remember_token)
    session[:user_id] = nil
    redirect_to root_url, notice: 'Logged out!'
  end
end
