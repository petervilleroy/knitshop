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
    #@solutions = Solution.where("user_id != ? AND level = ?", @user.id, @level).take(125) ---- This fancy Ruby select doesn't work because it returns an object lacking the fields of 'user', i.e. @sol.first_name doesn't exist. Resolution is to query by SQL and get a more flexible object as a result.
    @solutions = Solution.find_by_sql("SELECT * from users INNER JOIN solutions ON users.id = solutions.user_id WHERE solutions.user_id != #{@user.id} AND level = #{@level} ").take(125)

    #Randomly choose one, and return it
    @sol = @solutions[Random.rand(@solutions.size)]
    #@soluser = User.find(@sol.user_id)
    #@sol.first_name = @soluser.first_name
    #@sol.gender = @soluser.gender
    #@sol.age = @soluser.age

    #Now purge sensitive data before responding
    @sol.password_digest = "<hidden>"
    @sol.last_name = "<hidden>"
    @sol.email = "<hidden>"
    @sol.role = "<hidden>"
    @sol.remember_digest = "<hidden>"
    
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
