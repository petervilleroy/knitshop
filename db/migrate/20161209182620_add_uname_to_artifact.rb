class AddUnameToArtifact < ActiveRecord::Migration
  def change
    add_column :artifacts, :uname, :string
  end
end
