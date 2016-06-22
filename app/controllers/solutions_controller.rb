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
    #@solutions = Solution.all
    #@user = User.find(params[:user])
    @user = current_user
    @level = params[:level]
    #don't find this users' solutions, find others for same level
    @solutions = Solution.where("user_id != ? AND level = ?", @user.id, @level).take(125)
#Solution.find(user_id not @user.id, level = @level)
    #Randomly choose one, and return it
    @sol = @solutions[Random.rand(@solutions.size)]
    respond_to do |format|
      format.html { render @sol }
      format.json { render json: @sol }
    end


  end

  # GET /solutions/1
  def show
  end

  private
  
  def solution_params
    params.require(:level, :content).permit(:user_id)
  end
end
