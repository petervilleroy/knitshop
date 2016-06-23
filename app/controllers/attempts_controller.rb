class AttemptsController < ApplicationController
  def new
    @attempt = Attempt.new
  end
  def create
    @attempt = current_user.attempts.new(level: params[:level], content: params[:content])
    respond_to do |format|
      @attempt.save
      format.html { redirect_to root_url }
      format.json {render :show, status: :created, location: @attempt }
    end
    
  end

end
