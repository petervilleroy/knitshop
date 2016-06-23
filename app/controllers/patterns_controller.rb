class PatternsController < ApplicationController
  def new
    @pattern = Pattern.new
  end
  def create
    if params[:solution_id] == 0 do
      @pattern = current_user.patterns.new(solution_id: current_user.solutions.last.id)
    end
    else
      @pattern = current_user.patterns.new(solution_id: params[:solution_id])    end  
    respond_to do |format|
      @pattern.save
      format.html { redirect_to root_url }
      format.json {render :show, status: :created, location: @pattern }
    end
    
  end

end
