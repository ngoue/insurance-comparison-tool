import { useState } from "react"

const insurancePlanFields = [
  {
    name: "planName",
    title: "Plan Name",
    initial: "",
    inputProps: {
      type: "text",
    },
  },
  {
    name: "premium",
    title: "Monthly Premium",
    initial: 0,
    inputProps: {
      type: "number",
    },
  },
  {
    name: "deductible",
    title: "Deductible",
    initial: 0,
    inputProps: {
      type: "number",
    },
  },
  {
    name: "coinsurance",
    title: "Coinsurance",
    initial: 0,
    inputProps: {
      type: "number",
    },
  },
  {
    name: "oopm",
    title: "Out-of-pocket Max",
    initial: 0,
    inputProps: {
      type: "number",
    },
  },
]

const createPlan = () =>
  insurancePlanFields.reduce((initial, field) => {
    initial[field.name] = field.initial
    return initial
  }, {})

const getCoverage = (expenses, plan) => {
  const premiums = plan.premium * 12
  const deductible = Math.min(expenses, parseFloat(plan.deductible))
  const coinsurance =
    expenses > parseFloat(plan.deductible)
      ? Math.min(
          parseFloat(plan.coinsurance) *
            (expenses - parseFloat(plan.deductible)),
          parseFloat(plan.oopm) - parseFloat(plan.deductible)
        )
      : 0
  return {
    premiums: premiums,
    deductible: deductible,
    coinsurance: coinsurance,
    outOfPocket: premiums + deductible + coinsurance,
  }
}

const InsurancePlan = ({ expenses, plan, onUpdate }) => {
  console.log(plan)
  const handleChange = (evt) =>
    onUpdate({ ...plan, [evt.target.name]: evt.target.value })

  return (
    <div className='insurance-plan'>
      {insurancePlanFields.map(({ name, title, initial, inputProps }) => (
        <div key={name} className='input-group'>
          <label for={name}>{title}</label>
          <input
            id={name}
            name={name}
            {...inputProps}
            value={plan[name]}
            onChange={handleChange}
          />
        </div>
      ))}
      <div className='projected'>
        <h2>Out-of-pocket:</h2>
        <pre>{JSON.stringify(getCoverage(expenses, plan), null, 2)}</pre>
      </div>
    </div>
  )
}

export default function Main() {
  const [expenses, setExpenses] = useState(0)
  const [plans, setPlans] = useState([createPlan()])

  const handleUpdate = (idx) => (updated) => {
    setPlans((plans) =>
      plans.map((plan, _idx) => (_idx === idx ? { ...updated } : plan))
    )
  }

  return (
    <div className='container'>
      <h1>Insurance Comparison Tool</h1>
      <div className='input-group'>
        <label for='expenses'>Projected Expenses</label>
        <input
          id='expenses'
          name='expenses'
          type='number'
          onChange={(evt) => setExpenses(evt.target.value)}
        />
      </div>
      {plans.map((plan, idx) => (
        <InsurancePlan
          plan={plan}
          expenses={expenses}
          onUpdate={handleUpdate(idx)}
        />
      ))}
    </div>
  )
}
