require 'rubygems'
require 'spork'
# require 'valid_attribute'
# require 'arel'


# http://railstutorial.org/chapters/static-pages#sec:spork
Spork.prefork do
  # Loading more in this block will cause your tests to run faster. However,
  # if you change any configuration or code from libraries loaded here, you'll
  # need to restart spork for it take effect.
  ENV['RAILS_ENV'] ||= 'test'

  require File.expand_path("../../config/environment", __FILE__)
  require 'rspec/rails'
  require 'rspec/autorun'
  require 'capybara/rspec'

  # Checks for pending migrations before tests are run.
  # If you are not using ActiveRecord, you can remove this line.
  ActiveRecord::Migration.check_pending! if defined?(ActiveRecord::Migration)

  RSpec.configure do |config|
    config.mock_with :rspec

    config.before(:suite) do
      #DatabaseCleaner.strategy = :transaction
      DatabaseCleaner.clean_with(:truncation)
    end

    #config.before(:all) do
    #  log.info self.class.description
    #end

    config.before(:each) do
      DatabaseCleaner.start
    end

    #config.include Devise::TestHelpers, :type => :controller
    config.after(:each) do
      DatabaseCleaner.clean
    end

    config.use_transactional_fixtures = false

    # Include factory methods in Rspec
    config.include FactoryGirl::Syntax::Methods

    # Hack
    ActiveSupport::Dependencies.clear
  end

end

Spork.each_run do
  # Dir["#{File.dirname(__FILE__)}/support/**/*.rb"].each { |f| require f }
  # Requires supporting ruby files with custom matchers and macros, etc,
  # in spec/support/ and its subdirectories.
  Dir[Rails.root.join("spec/support/**/*.rb")].each { |f| require f }


  RSpec.configure do |config|
    #def log
      #MyLog.log
    #end
    config.include Helpers
  end

  #include Helpers
  FactoryGirl.reload
end
