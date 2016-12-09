class FavoritesController < ApplicationController
  def new
    @favorite = Favorite.new
  end

  def create
    @favorite = current_user.favorites.new(thumbnail: params[:image], code: params[:code])
    respond_to do |format|
      @favorite.save
      format.html { redirect_to root_url }
      format.json {render :show, status: :created, location: @favorite }
    end
    
  end

  def destroy
  end

  # GET /favorites
  def index
    @user = current_user
    
    #don't find this users' solutions, find others for same level
    #@solutions = Solution.where("user_id != ? AND level = ?", @user.id, @level).take(125) ---- This fancy Ruby select doesn't work because it returns an object lacking the fields of 'user', i.e. @sol.first_name doesn't exist. Resolution is to query by SQL and get a more flexible object as a result.
    @favorites = Favorite.find_by_sql("SELECT * from users INNER JOIN favorites ON users.id = favorites.user_id WHERE favorites.user_id = #{@user.id} ").take(125)

    
    
    respond_to do |format|
      format.html { render @favorites }
      format.json { render json: @favorites }
    end


  end

  # GET /favorites/1
  def show
  end

  private
  
  def favorite_params
    params.require(:level, :content).permit(:user_id)
  end
end
