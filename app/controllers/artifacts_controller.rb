class ArtifactsController < ApplicationController
  before_action :set_artifact, only: [:show, :edit, :update, :destroy]
  before_action :logged_in_user, only: [:show, :create, :destroy, :new]
  before_action :correct_user,   only: [:edit, :update, :destroy]
  
  # GET /artifacts
  # GET /artifacts.json
  def index
    @artifacts = Artifact.all
  end

  # GET /artifacts/1
  # GET /artifacts/1.json
  def show
  end

  # GET /artifacts/new
  def new
    @artifact = Artifact.new
  end

  # GET /artifacts/1/edit
  def edit
  end

  # POST /artifacts
  # POST /artifacts.json
  def create
    #@artifact = Artifact.new(artifact_params)
    @artifact = current_user.artifacts.new(code: params[:code], thumbnail: params[:thumbnail], uname: params[:uname], user_id: current_user.id)
    
    respond_to do |format|
      if @artifact.save
        format.html { redirect_to @artifact, notice: 'Artifact was successfully created.' }
        format.json { render :show, status: :created, location: @artifact }
      else
        format.html { render :new }
        format.json { render json: @artifact.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /artifacts/1
  # PATCH/PUT /artifacts/1.json
  def update
    respond_to do |format|
      if @artifact.update(artifact_params)
        format.html { redirect_to @artifact, notice: 'Artifact was successfully updated.' }
        format.json { render :show, status: :ok, location: @artifact }
      else
        format.html { render :edit }
        format.json { render json: @artifact.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /artifacts/1
  # DELETE /artifacts/1.json
  def destroy
    @artifact.favorites.destroy
    @artifact.destroy

    respond_to do |format|
      format.html { redirect_to favorites_url, notice: 'Artifact was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_artifact
      @artifact = Artifact.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def artifact_params
      params.require(:artifact).permit(:description, :uimage, :thumbnail, :code, :uname, :uimage_file_name, :uimage_content_type, :uimage_file_size, :uimage_updated_at)
    end

  # Confirms a logged-in user.
   def logged_in_user
     if current_user.nil?
       redirect_to login_url, notice: 'KnitCircle is only for logged in users. Please log in.'
     end
   end
   # Confirms the user logged in is authorized to see content
    def correct_user
      set_artifact
      @user = User.find(@artifact.user_id)
      @role = current_user.role
      redirect_to('/knitcircle/community') unless @user == current_user || @role == 'admin'
    end
end
