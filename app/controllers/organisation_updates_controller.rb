# encoding: utf-8
# author: Boris Barroso
# email: boriscyber@gmail.com
class OrganisationUpdatesController < ApplicationController
  def edit
    @organisation = current_organisation
  end

  def update
    @organisation = current_organisation
    
    if @organisation.update(organisation_params)
      redirect_to configurations_path(anchor: 'organisation'), notice: 'Se actualizo correctamente los datos de su empresa.'
    else
      render :edit
    end
  end

  private

    def organisation_params
      params.require(:organisation)
      .permit(:name, :address, :email, :website, :phone, :mobile, :country_code, :inventory,
             :country_code, :time_zone,
             :header_css)
    end
end
