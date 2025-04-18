# encoding: utf-8
# author: Boris Barroso
# email: boriscyber@gmail.com
class ExportIncomesController < ApplicationController
  include ::Controllers::DateRange

  before_action :set_date_range

  # GET /export_incomes
  def index
  end

  # POST /export_incomes
  def create
    exp = Incomes::Export.new(@date_range)

    respond_to do |format|
      format.xls { send_data StringEncoder.encode("UTF-8", "ISO-8859-1", exp.export(col_sep: "\t") ), filename: 'ingresos.xls' }
    end
  end
end
