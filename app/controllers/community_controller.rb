class CommunityController < ApplicationController
  # GET /knitcircle/community
  def index
    @artifacts = Artifact.all
  end
end
