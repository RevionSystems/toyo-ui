import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { Alert, Dialog, TextField } from '@toyo-ui/react';
import { useId, useState } from 'react';
import { isSemver, type Environment, type Release, type ReleaseApi } from './releases';

interface Props {
  open: boolean;
  api: ReleaseApi;
  onClose: () => void;
  onCreated: (release: Release) => void;
}

const EMPTY = { service: '', version: '', owner: '', environment: 'staging' as Environment };

export function NewReleaseDialog({ open, api, onClose, onCreated }: Props) {
  const [values, setValues] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [requestError, setRequestError] = useState<string>();
  const envLabel = useId();

  const errors = {
    service: !values.service.trim()
      ? 'Service name is required.'
      : /\s/.test(values.service.trim())
        ? 'Use kebab-case without spaces.'
        : undefined,
    version: !values.version.trim()
      ? 'Version is required.'
      : !isSemver(values.version)
        ? 'Use semantic versioning, e.g. 2.4.0.'
        : undefined,
    owner: !values.owner.trim() ? 'Owning team is required.' : undefined,
  };
  const valid = !errors.service && !errors.version && !errors.owner;
  const show = (field: keyof typeof errors) => (submitted ? errors[field] : undefined);
  const set = (field: keyof typeof EMPTY) => (value: string) => setValues((v) => ({ ...v, [field]: value }));

  const close = () => {
    setValues(EMPTY);
    setSubmitted(false);
    setRequestError(undefined);
    onClose();
  };

  // Never rejects: failures are shown inside the dialog, which stays open for another attempt.
  const confirm = async () => {
    setSubmitted(true);
    setRequestError(undefined);
    if (!valid) return;
    try {
      const release = await api.create({
        ...values,
        service: values.service.trim(),
        version: values.version.trim(),
        owner: values.owner.trim(),
      });
      onCreated(release);
      close();
    } catch (e) {
      setRequestError(e instanceof Error ? e.message : 'The release could not be created.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      title="Schedule a release"
      description="The release is scheduled and starts with the next deployment window."
      confirmLabel="Schedule release"
      onConfirm={confirm}
      size="medium"
    >
      <Box
        component="form"
        noValidate
        onSubmit={(e) => e.preventDefault()}
        sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, pt: 1 }}
      >
        {requestError && (
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Alert severity="error" title="Not scheduled">
              {requestError}
            </Alert>
          </Box>
        )}
        <TextField
          label="Service"
          required
          value={values.service}
          onChange={set('service')}
          errorMessage={show('service')}
          helperText="e.g. checkout-api"
          fullWidth
        />
        <TextField
          label="Version"
          required
          value={values.version}
          onChange={set('version')}
          errorMessage={show('version')}
          helperText="Semantic version"
          fullWidth
        />
        <TextField
          label="Owning team"
          required
          value={values.owner}
          onChange={set('owner')}
          errorMessage={show('owner')}
          fullWidth
        />
        <Box>
          <Typography id={envLabel} variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Environment
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            fullWidth
            value={values.environment}
            onChange={(_, v: Environment | null) => v && setValues((s) => ({ ...s, environment: v }))}
            aria-labelledby={envLabel}
          >
            <ToggleButton value="canary">Canary</ToggleButton>
            <ToggleButton value="staging">Staging</ToggleButton>
            <ToggleButton value="production">Production</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
    </Dialog>
  );
}
