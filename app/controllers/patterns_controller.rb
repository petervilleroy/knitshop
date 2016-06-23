class PatternsController < ApplicationController
  def new
    @pattern = Pattern.new
  end
  def create
    if params[:solution_id] == '0' then 
      @pattern = current_user.patterns.new(solution_id: current_user.solutions.last.id)
    
    else 
      @pattern = current_user.patterns.new(solution_id: params[:solution_id])    end  
    respond_to do |format|
      @pattern.save
      format.html { redirect_to root_url }
      format.json {render :show, status: :created, location: @pattern }
    end
    
  end

  # GET /patterns
  def index
    @user = current_user
    #Return all solutions saved by this user, sorted by level and username?
    @patterns = Solution.find_by_sql("SELECT * from patterns INNER JOIN solutions ON solutions.id = patterns.solution_id WHERE patterns.user_id = #{@user.id} ").take(125)

    respond_to do |format|
      format.html { render @patterns }
      format.json { render json: @patterns }
    end
  end
end
