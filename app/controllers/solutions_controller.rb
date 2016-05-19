class SolutionsController < ApplicationController
  def new
    @solution = Solution.new
  end

  def create
    @solution = current_user.solutions.new(level: params[:level], content: params[:content])
    respond_to do |format|
      @solution.save
      format.html { redirect_to root_url }
      format.json {render :show, status: :created, location: @solution }
    end
    
  end

  def destroy
  end

  # GET /solutions
  def index
    @solutions = Solution.all
  end

  # GET /solutions/1
  def show
  end

  private
  
  def solution_params
    params.require(:level, :content).permit(:user_id)
  end
end
