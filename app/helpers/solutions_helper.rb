module SolutionsHelper

  def persist_solution(user, level, content)
    user.solutions.create(level: level, content: content)
  end

end
