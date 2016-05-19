class SolutionsController < ApplicationController

  # GET /solutions
  def index
    @solutions = Solution.all
  end

  # GET /solutions/1
  def show
  end

end
