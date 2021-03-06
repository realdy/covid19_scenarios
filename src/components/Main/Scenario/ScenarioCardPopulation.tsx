// Contains the general template for the help buttons
import React from 'react'
import i18next from 'i18next'

import { FormikErrors, FormikTouched, FormikValues } from 'formik'

import { useTranslation } from 'react-i18next'

import { caseCountsNames } from '../state/caseCountsData'
import { ageDistributionNames } from '../state/countryAgeDistributionData'

import { CUSTOM_COUNTRY_NAME, NONE_COUNTRY_NAME } from '../state/state'

import { CardWithoutDropdown } from '../../Form/CardWithoutDropdown'
import { FormDatePicker } from '../../Form/FormDatePicker'
import { FormDropdown } from '../../Form/FormDropdown'
import { FormSpinBox } from '../../Form/FormSpinBox'

const countryOptions = ageDistributionNames.map((country) => ({ value: country, label: country }))
countryOptions.push({ value: CUSTOM_COUNTRY_NAME, label: i18next.t(CUSTOM_COUNTRY_NAME) })

const caseCountOptions = caseCountsNames.map((country) => ({ value: country, label: country }))
caseCountOptions.push({ value: NONE_COUNTRY_NAME, label: i18next.t(NONE_COUNTRY_NAME) })

// According to the following link: https://github.com/i18next/react-i18next/issues/387,
// i18next doesn't properly render colons if this isn't included
i18next.init({
  // allow keys to be phrases having `:`, `.`
  nsSeparator: false,
  keySeparator: false,
})

export interface ScenarioCardPopulationProps {
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
  srcHospitalBeds?: string
  srcICUBeds?: string
  srcPopulation?: string
  scenarioName: string
}
function getSrcStrings(srcHospitalBeds?: string, srcICUBeds?: string, srcPopulation?: string) {
  let ret = ['Source: ', 'Source: ', 'Source ']
  const negMsg = 'No data source in our records'
  if (srcPopulation === undefined || srcPopulation === 'None') {
    ret[0] = negMsg
  } else {
    ret[0] = ret[0].concat(srcPopulation)
  }
  if (srcHospitalBeds === undefined || srcHospitalBeds === 'None') {
    ret[1] = negMsg
  } else {
    ret[1] = ret[1].concat(srcHospitalBeds)
  }
  if (srcICUBeds === undefined || srcICUBeds === 'None') {
    ret[2] = negMsg
  } else {
    ret[2] = ret[2].concat(srcICUBeds)
  }
  return ret
}
function ScenarioCardPopulation({
  errors,
  touched,
  srcHospitalBeds,
  srcICUBeds,
  srcPopulation,
  scenarioName,
}: ScenarioCardPopulationProps) {
  // detect if src strings are undefined or have no value
  // if undefined, set them to a "Source cannot be provided"
  let srcStr = []
  if (scenarioName === 'Custom') {
    srcStr = ['', '', '']
  } else {
    srcStr = getSrcStrings(srcHospitalBeds, srcICUBeds, srcPopulation)
  }
  const { t } = useTranslation()
  // const populationScenarioOptions = stringsToOptions(scenarioState.population.scenarios)
  // function handleChangePopulationScenario(newPopulationScenario: string) {
  //   scenarioDispatch(setPopulationScenario({ scenarioName: newPopulationScenario }))
  // }

  return (
    <CardWithoutDropdown
      className="card--population h-100"
      identifier="populationScenario"
      label={<h3 className="p-0 m-0 d-inline text-truncate">{t('Population')}</h3>}
      help={t('Parameters of the population in the health care system.')}
    >
      <FormSpinBox
        identifier="population.populationServed"
        label={t('Population')}
        help={t('Number of people served by health care system. '.concat(srcStr[0]))}
        step={1}
        min={0}
        errors={errors}
        touched={touched}
      />
      <FormDropdown<string>
        identifier="population.country"
        label={t('Age distribution')}
        help={t('Country to determine the age distribution in the population')}
        options={countryOptions}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="population.initialNumberOfCases"
        label={t('Initial number of cases')}
        help={t('Number of cases present at the start of simulation')}
        step={1}
        min={0}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="population.importsPerDay"
        label={t('Imports per day')}
        help={t('Number of cases imported from the outside per day on average')}
        step={0.1}
        min={0}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="population.hospitalBeds"
        label={`${t('Hospital Beds')} (${t('est.')})`}
        // There's a bug in rendering special characters. For example for, "https://..."" the ':' character causes an error in rendering
        // Also need to find out how to input newline characters just for nice spacing
        help={t(
          'Number of hospital beds available in health care system. Number of beds available for COVID-19 treatment is likely much lower. '.concat(
            srcStr[1],
          ),
        )}
        step={1}
        min={0}
        errors={errors}
        touched={touched}
      />
      <FormSpinBox
        identifier="population.ICUBeds"
        label={`${t('ICU/ICMU')} (${t('est.')})`}
        help={t(
          'Number of ICU/ICMUs available in health care system. Number of ICU/ICMUs available for COVID-19 treatment is likely much lower. '.concat(
            srcStr[2],
          ),
        )}
        step={1}
        min={0}
        errors={errors}
        touched={touched}
      />
      <FormDropdown<string>
        identifier="population.cases"
        label={t('Confirmed cases')}
        help={t('Select region for which to plot confirmed case and death counts.')}
        options={caseCountOptions}
        errors={errors}
        touched={touched}
      />
      <FormDatePicker
        identifier="simulation.simulationTimeRange"
        label={t('Simulation time range')}
        help={t(
          'Start and end date of the simulation. Changing the time range might affect the result due to resampling of the mitigation curve.',
        )}
      />
    </CardWithoutDropdown>
  )
}

export { ScenarioCardPopulation }
