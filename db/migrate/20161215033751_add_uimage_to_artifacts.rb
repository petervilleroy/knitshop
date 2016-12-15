class AddUimageToArtifacts < ActiveRecord::Migration
  def self.up
    add_attachment :artifacts, :uimage
  end

  def self.down
    remove_attachment :artifacts, :uimage
  end
end
