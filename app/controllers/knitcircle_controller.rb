class KnitcircleController < ApplicationController
before_action :logged_in_user, only: [:index]
  
 def index

 end
 private
   # Confirms a logged-in user.
    def logged_in_user
      if current_user.nil?
        redirect_to login_url, notice: 'KnitCircle is only for logged in users. Please log in.'
      end
    end
end
